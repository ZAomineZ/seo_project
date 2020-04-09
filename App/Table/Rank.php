<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 02/10/19
 * Time: 03:30
 */

namespace App\Table;

use App\Model\PDO_Model;
use PDOStatement;

class Rank extends Table
{
    /**
     * Rank constructor.
     * @param PDO_Model $PDO_Model
     */
    public function __construct(PDO_Model $PDO_Model)
    {
        parent::__construct($PDO_Model);
    }

    /**
     * @param array $data
     * @param string $table
     * @return bool
     */
    public function InsertData(array $data, string $table): bool
    {
        return parent::InsertData($data, $table);
    }

    /**
     * @param string|int $id
     * @param bool $limit
     * @return mixed
     */
    public function selectRank($id, bool $limit = false)
    {
        if ($limit) {
            $statement = $this->pdo->GetPdo()
                ->prepare("SELECT * FROM rank WHERE user_id = ? ORDER BY id DESC LIMIT 1");
        } else {
            $statement = $this->pdo->GetPdo()
                ->prepare("SELECT * FROM rank WHERE id = ?");
        }
        $statement->execute([$id]);
        return $statement->fetch();
    }

    /**
     * @param int $user_id
     * @return array
     */
    public function SelectAllProjectByUser(int $user_id): array
    {
        $statement = $this->pdo->GetPdo()
            ->prepare("SELECT * FROM rank WHERE user_id = ? ORDER BY id DESC");
        $statement->execute([$user_id]);
        return $statement->fetchAll();
    }

    /**
     * @param array $data
     * @return bool
     */
    public function UpdateData(array $data): bool
    {
        $statement = $this->pdo->GetPdo()
            ->prepare("UPDATE rank SET project = :project, website = :website, slug = :slug, content = :content, created_at = :created_at, keywords = :keywords WHERE id = :id");
        return $statement->execute([
            'project' => $data['project'],
            'slug' => $data['slug'],
            'website' => $data['website'],
            'content' => $data['content'],
            'created_at' => $data['created_at'],
            'keywords' => $data['keywords'],
            'id' => (int)$data['id']
        ]);
    }

    /**
     * @param int $id
     * @return bool
     */
    public function UpdateCreated(int $id)
    {
        $statement = $this->pdo->GetPdo()
            ->prepare("UPDATE rank SET created_at = :created WHERE id = :id");
        return $statement->execute(['created' => date('Y-m-d H:i:s'), 'id' => $id]);
    }

    /**
     * @param $auth
     * @param string $project
     * @param null|string|int $id
     * @param bool $element
     * @return mixed
     */
    public function selectProject($auth, string $project, $id = null, bool $element = false)
    {
        if (!is_null($id)) {
            $statement = $this->pdo->GetPdo()
                ->prepare("SELECT id FROM rank WHERE project = :project AND user_id = :userID AND id != :id");
            $statement->execute([
                'userID' => $auth->id,
                'project' => $project,
                'id' => $id
            ]);
        } else {
            $statement = $this->pdo->GetPdo()
                ->prepare("SELECT id, slug, website, user_id, keywords FROM rank WHERE project = :project AND user_id = :userID");
            $statement->execute([
                'userID' => $auth->id,
                'project' => $project
            ]);
        }
        $fetch = $statement->fetch();
        if ($element) {
            return $fetch;
        }

        if ($fetch && $fetch->id) {
            return true;
        }
        return false;
    }

    /**
     * @param $auth
     * @param int $id
     * @return \stdClass
     */
    public function selectProjectById($auth, int $id): \stdClass
    {
        $statement = $this->pdo->GetPdo()
            ->prepare("SELECT id, slug, website, user_id, keywords FROM rank WHERE user_id = :userID AND id = :id");
        $statement->execute([
            'userID' => $auth->id,
            'id' => $id
        ]);
        return $statement->fetch();
    }

    /**
     * @param $auth
     * @param string $project
     * @return mixed
     */
    public function selectProjectBySlug($auth, string $project)
    {
        $statement = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id, project, user_id, slug, keywords, website FROM rank WHERE slug = :slug AND user_id = :userID");
        $statement->execute([
            'slug' => $project,
            'userID' => $auth->id
        ]);
        return $statement->fetch();
    }

    /**
     * @param $auth
     * @param string $id
     * @return bool|PDOStatement
     */
    public function deleteProject($auth, string $id)
    {
        $statement = $this->pdo
            ->GetPdo()
            ->prepare('DELETE FROM rank WHERE id = :id AND user_id = :userID');
        $statement->execute([
            'id' => $id,
            'userID' => $auth->id
        ]);
        return $statement;
    }

    /**
     * @param string|int $userID
     * @return mixed
     */
    public function countProjectByUser($userID)
    {
        $statement = $this->pdo
            ->GetPdo()
            ->prepare('SELECT count(id) as idCount FROM rank WHERE user_id = :userID');
        $statement->execute([
            'userID' => $userID
        ]);
        return $statement->fetch();
    }

    /**
     * @return array
     */
    public function selectAllKeywords()
    {
        $statement = $this->pdo->GetPdo()->query('SELECT id, slug, user_id, keywords, website, created_at FROM rank');
        return $statement->fetchAll();
    }
}
